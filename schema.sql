
CREATE TABLE IF NOT EXISTS userClass (
    id varchar(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(50)
);

use sigmaClass;
SELECT * FROM userClass ORDER BY username ASC;