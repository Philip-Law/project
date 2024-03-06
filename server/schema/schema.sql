CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    auth0_id VARCHAR UNIQUE NOT NULL,
    major VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    phone_number VARCHAR NOT NULL,
    tmu_email VARCHAR NOT NULL
);

CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR NOT NULL,
    ad_type VARCHAR(1) NOT NULL,
    description VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    categories VARCHAR[] NOT NULL,
    price DECIMAL NOT NULL,
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id),
    FOREIGN KEY (receiver_id) REFERENCES Users(id),
    FOREIGN KEY (post_id) REFERENCES Posts(id)
);
