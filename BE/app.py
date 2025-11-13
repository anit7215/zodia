from flask import Flask, Response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
from googletrans import Translator 

app = Flask(__name__)
CORS(app)

ZODIAC_ID_TO_KR = {
    "mizugame": "물병자리",
    "futago": "쌍둥이자리",
    "ite": "사수자리",
    "tenbin": "천칭자리",
    "sisi": "사자자리",
    "otome": "처녀자리",
    "sasori": "전갈자리",
    "ousi": "황소자리",
    "uo": "물고기자리",
    "ohitsuji": "양자리",
    "kani": "게자리",
    "yagi": "염소자리"
}

def translate_to_korean(text):
    if not text:
        return None
    
    try:
        translator = Translator()
        result = translator.translate(text, src='ja', dest='ko')
        return result.text
    except Exception as e:
        print(f"!!! 구글 번역 오류: {e} !!!")
        return text

def get_goodmorning_fortunes():
    
    URL = "https://www.tv-asahi.co.jp/goodmorning/uranai/"
    HEADERS = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(URL, headers=HEADERS)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser', from_encoding='shift_jis')

        today_date_str = soup.select_one("p.ttl-area").get_text(strip=True)
        print(f"오늘의 날짜: {today_date_str}")
        
        rank_links = soup.select("div.rank-area ul.rank-box li a")
        rank_map = {}
        for i, link in enumerate(rank_links):
            rank = i + 1
            sign_id = link.get('data-label')
            if sign_id:
                rank_map[sign_id] = rank

        if len(rank_map) != 12:
            print(f"오류: 순위 정보 파싱 실패")
            return None

        detail_boxes = soup.select("div.seiza-area div.seiza-box")
        fortune_list = []
        
        print("12개 별자리 파싱 및 번역 시작!")

        for box in detail_boxes:
            sign_id = box.get('id')
            if not sign_id or sign_id not in ZODIAC_ID_TO_KR:
                continue

            sign_name_jp_el = box.select_one("p.seiza-txt")
            content_jp_el = box.select_one("p.read")
            lucky_color_node = box.select_one("span.lucky-color-txt").next_sibling
            lucky_key_node = box.select_one("span.key-txt").next_sibling

            if not (sign_name_jp_el and content_jp_el):
                continue

            sign_name_kr = ZODIAC_ID_TO_KR[sign_id]
            content_jp = content_jp_el.get_text(strip=True)
            
            lucky_color = lucky_color_node.strip().lstrip('：') if lucky_color_node and isinstance(lucky_color_node, str) else ""
            lucky_key = lucky_key_node.strip().lstrip('：') if lucky_key_node and isinstance(lucky_key_node, str) else ""

            full_content_jp = f"{content_jp} (ラッキーカラー: {lucky_color}, 幸運のカギ: {lucky_key})"
            
            content_kr = translate_to_korean(full_content_jp)
            
            fortune_data = {
                "rank": rank_map.get(sign_id, 99),
                "sign": sign_name_kr, 
                "content_jp": full_content_jp,
                "content_kr": content_kr 
            }
            fortune_list.append(fortune_data)
        
        print("파싱 및 번역 완료!")
        
        fortune_list.sort(key=lambda x: x['rank'])
        return fortune_list

    except Exception as e:
        print(f"Scraping Error: {e}") 
        return None

@app.route('/api/fortunes')
def get_fortunes_api():
    fortunes = get_goodmorning_fortunes() 
    if fortunes:
        fortunes_json = json.dumps(fortunes, ensure_ascii=False, indent=2)
        return Response(fortunes_json, content_type='application/json; charset=utf-8')
    else:
        error_data = {"error": "Failed to fetch fortunes."}
        error_json = json.dumps(error_data, ensure_ascii=False)
        return Response(error_json, content_type='application/json; charset=utf-8', status=500)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)