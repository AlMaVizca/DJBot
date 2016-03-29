from flask import Flask, Response, render_template, request


DEBUG = True
app = Flask(__name__)
app.secret_key = 'DevDThelopmente'
app.config.from_object(__name__)



@app.route('/', methods=['GET', 'POST'])
def index():
    page = {'error': False}
    return render_template('home.html', page=page)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
