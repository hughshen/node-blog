# Node Blog

Node.js + Express + MySQL simple blog built on Node.js.

### Demo

```bash
# Clone from git
git clone https://github.com/hughshen/node-blog.git && cd node-blog

# Install dependencies
npm install

# MySQL configuration
cp config.example config.js

# Create tables and insert fake data
node migrate.js

# Run
node app.js

# Run in debug mode
DEBUG=express:* node app.js
```

Now you can open your browser: `http://localhost:3000`.

Test user: `admin@admin.com:admin`.

### Screenshot

![Screenshot](https://raw.github.com/hughshen/node-blog/master/sample.png)

### License

MIT
