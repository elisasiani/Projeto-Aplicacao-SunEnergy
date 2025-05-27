from flask import Flask, render_template, request
import mysql.connector

app = Flask(__name__)

def conectar():
    return mysql.connector.connect(
        host="localhost",
        user="root",            # Troque para o usuário correto
        password="",            # Coloque a senha correta. Se estiver em branco, deixe assim.
        database="bd_placas"
    )


@app.route('/')
def formulario():
    return render_template('index.html')  # este arquivo está na pasta "templates"

@app.route('/cadastro_placa', methods=['POST'])
def cadastro_placa():
    dados = {
        "codigo": request.form['codigo'],
        "modelo": request.form['modelo'],
        "fabricante": request.form['fabricante'],
        "potencia": request.form['potencia'],
        "tensao": request.form['tensao'],
        "corrente": request.form['corrente'],
        "tipo": request.form['tipo']
    }

    try:
        conexao = conectar()
        cursor = conexao.cursor()
        query = """
            INSERT INTO placas (codigo, modelo, fabricante, potencia, tensao, corrente, tipo)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, tuple(dados.values()))
        conexao.commit()
        cursor.close()
        conexao.close()
        return "Cadastro realizado com sucesso!"
    except Exception as e:
        return f"Erro ao cadastrar: {e}"

if __name__ == '__main__':
    app.run(debug=True)

@app.route('/listar')
def listar():
    try:
        conexao = conectar()
        cursor = conexao.cursor(dictionary=True)
        cursor.execute("SELECT * FROM placas")
        placas = cursor.fetchall()
        cursor.close()
        conexao.close()
        return render_template('listar.html', placas=placas)
    except Exception as e:
        return f"Erro ao listar placas: {e}"

    
