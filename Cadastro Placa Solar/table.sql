<<<<<<< HEAD
CREATE TABLE IF NOT EXISTS placas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    potencia FLOAT NOT NULL,
    tensao FLOAT NOT NULL,
    corrente FLOAT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
=======
CREATE TABLE IF NOT EXISTS placas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NOT NULL,
    fabricante VARCHAR(100) NOT NULL,
    potencia FLOAT NOT NULL,
    tensao FLOAT NOT NULL,
    corrente FLOAT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
>>>>>>> 64f72f13278b30536bd7ce7c68bf70a4ad7f37b0
    );