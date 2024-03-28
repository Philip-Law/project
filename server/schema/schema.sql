CREATE TABLE Users (
    id VARCHAR PRIMARY KEY,
    phone_number VARCHAR(15) NOT NULL,
    major VARCHAR NOT NULL,
    year INTEGER NOT NULL
);

CREATE TABLE Posts (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    ad_type VARCHAR(1) NOT NULL,
    description VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    categories VARCHAR[] NOT NULL,
    price DECIMAL NOT NULL,
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Conversations (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    seller_id VARCHAR NOT NULL,
    buyer_id VARCHAR NOT NULL,
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES Users(id) ON DELETE CASCADE,
    CHECK ( seller_id <> buyer_id )
);

CREATE TABLE Messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    sender_id VARCHAR NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES Conversations(id) ON DELETE CASCADE
);
