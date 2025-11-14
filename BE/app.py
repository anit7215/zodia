from flask import Flask, Response
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
from googletrans import Translator
from datetime import datetime

app = Flask(__name__)
CORS(app)

DAILY_CACHE = {
    "date": None,
    "data": None
}

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
    today_str = datetime.now().strftime('%Y-%m-%d')
    
    # 이미 오늘 데이터를 가져왔다면 저장된 거 반환!
    if DAILY_CACHE["date"] == today_str and DAILY_CACHE["data"] is not None:
        print(f"오늘({today_str}) 데이터가 있어 스크래핑 생략! 캐시에서 반환")
        return DAILY_CACHE["data"]

    # 데이터 없으면 스크래핑 시작
    print(f"{today_str} 새로운 데이터 스크래핑 및 번역 시작!")
    
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
            sign_id = link.get('data-label')
            if sign_id: rank_map[sign_id] = i + 1

        detail_boxes = soup.select("div.seiza-area div.seiza-box")
        fortune_list = []

        for box in detail_boxes:
            sign_id = box.get('id')
            if not sign_id or sign_id not in ZODIAC_ID_TO_KR: continue

            content_jp_el = box.select_one("p.read")
            lucky_color_node = box.select_one("span.lucky-color-txt").next_sibling
            lucky_key_node = box.select_one("span.key-txt").next_sibling

            if not content_jp_el: continue


            sign_name_kr = ZODIAC_ID_TO_KR[sign_id]
            content_jp = content_jp_el.get_text(strip=True)
            color_jp = lucky_color_node.strip().lstrip('：') if lucky_color_node else ""
            item_jp = lucky_key_node.strip().lstrip('：') if lucky_key_node else ""

            content_kr = translate_to_korean(content_jp)
            color_kr = translate_to_korean(color_jp)
            item_kr = translate_to_korean(item_jp)

            full_content_kr = f"{content_kr} (행운의 색: {color_kr}, 행운의 열쇠: {item_kr})"
            
            fortune_data = {
                "rank": rank_map.get(sign_id, 99),
                "sign": sign_name_kr,
                "content_jp": content_jp,
                "content_kr": full_content_kr,
                "lucky_color": color_kr,
                "lucky_item": item_kr
            }
            fortune_list.append(fortune_data)
        
        fortune_list.sort(key=lambda x: x['rank'])
        
        DAILY_CACHE["date"] = today_str
        DAILY_CACHE["data"] = fortune_list
        print("데이터 처리 완료 및 캐시 저장!")
        
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