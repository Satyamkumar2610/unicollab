const http = require('http');

const makeRequest = (path, method, body, token) => {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3001,
            path: `/api/auth${path}`,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
};

const run = async () => {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    const userData = {
        name: 'Test User',
        email,
        password,
        university: 'Test Uni',
        major: 'Computer Science'
    };

    console.log('--- Testing Registration ---');
    try {
        const regRes = await makeRequest('/register', 'POST', userData);
        console.log('Registration Status:', regRes.status);
        console.log('Registration Response:', JSON.stringify(regRes.data, null, 2));

        if (regRes.status !== 201) {
            console.error('Registration failed!');
            return;
        }

        const token = regRes.data.token;
        console.log('\n--- Testing Login ---');
        const loginRes = await makeRequest('/login', 'POST', { email, password });
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', JSON.stringify(loginRes.data, null, 2));

        if (loginRes.status !== 200) {
            console.error('Login failed!');
            return;
        }

        console.log('\n--- Testing Protected Route (/me) ---');
        const meRes = await makeRequest('/me', 'GET', null, token);
        console.log('Me Status:', meRes.status);
        console.log('Me Response:', JSON.stringify(meRes.data, null, 2));

        if (meRes.status !== 200) {
            console.error('Protected route failed!');
        } else {
            console.log('All tests passed!');
        }

    } catch (error) {
        console.error('Request failed:', error.message);
        console.log('Is the server running on port 3001?');
    }
};

run();
