from bson import ObjectId
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

from bson.json_util import dumps

from pymongo import MongoClient
import certifi

ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.nban6ul.mongodb.net/?retryWrites=true&w=majority',
                     tlsCAFile=ca)
db = client.dbsparta
guestBook = db.collection['guestBook']


# 메인페이지 연결
@app.route('/')
def home(): return render_template('index.html');


# 방명록페이지 연결
@app.route('/guestBook')
def go_guest_book(): return render_template('guestBook.html')


# 방명록 추가
@app.route("/guestBook/insert", methods=["POST"])
def insert_guest_book():
    guest_name = request.form['guestName']
    guest_contents = request.form['guestContents']

    doc = {
        'name': guest_name,
        'contents': guest_contents
    }
    guestBook.insert_one(doc)

    return jsonify({'msg': '등록 완료'})


# 방명록 변경
@app.route("/guestBook/update", methods=["POST"])
def update_guest_book():
    guest_book_id = request.form['id']
    guest_name = request.form['guestName']
    guest_contents = request.form['guestContents']

    doc = {
        'name': guest_name,
        'contents': guest_contents
    }
    guestBook.update_one({'_id', ObjectId(guest_book_id)}, doc)

    return jsonify({'msg': '변경 완료'})


# 방명록 삭제
@app.route("/guestBook/delete", methods=["POST"])
def delete_guest_book():
    guest_book_id = request.form['id']
    db.supports.delete_one({'_id': ObjectId(guest_book_id)})
    return jsonify({'msg': '삭제 완료'})


# 방명록 리스트 조회
@app.route("/guestBook/list", methods=["GET"])
def get_list_guest_book():
    support_list = list(guestBook.find({}))
    return jsonify({'supports': dumps(support_list)})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
