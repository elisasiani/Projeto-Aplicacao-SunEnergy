CREATE TABLE IF NOT EXISTS placas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    potencia FLOAT NOT NULL,
    tensao FLOAT NOT NULL,
    corrente FLOAT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    );