from flask import Flask, render_template, request, jsonify
app = Flask(__name__)


from pymongo import MongoClient
import certifi
ca = certifi.where()
client = MongoClient('mongodb+srv://test:sparta@cluster0.nban6ul.mongodb.net/?retryWrites=true&w=majority', tlsCAFile=ca)
db = client.dbsparta



@app.route('/')
def home():
    return render_template('index.html')

@app.route("/fan", methods=["POST"])
def support_post():
    name_receive = request.form['name_give']
    support_receive = request.form['support_give']
    support_list = list(db.supports.find({},{'_id':False}))
    count = len(support_list) + 1

    print(name_receive, support_receive)
    doc = {
        'num':count,
        'name':name_receive,
        'support':support_receive
    }
    db.supports.insert_one(doc)

    return jsonify({'msg':'응원 완료!'})


@app.route("/fan/delete", methods=["POST"])
def delete_post():
    num_receive = request.form['num_give']
    print(num_receive)
    db.supports.delete_one({'num': int(num_receive)})
    return jsonify({'msg':'삭제 완료!'})


@app.route("/fan", methods=["GET"])
def support_get():
    support_list = list(db.supports.find({}, {'_id': False}))
    return jsonify({'supports': support_list})



if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)