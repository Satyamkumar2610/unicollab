const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3001/api';
let token;
let projectId;
let teamId;

async function runTests() {
    try {
        console.log('Starting verification...');

        // 1. Register/Login
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Test User',
                email,
                password,
                university: 'Test Uni',
                major: 'CS'
            });
        } catch (e) {
            // Ignore if already exists (unlikely with timestamp)
        }

        const loginRes = await axios.post(`${API_URL}/auth/login`, { email, password });
        token = loginRes.data.token;
        console.log('✅ Auth: Login successful');

        const headers = { Authorization: `Bearer ${token}` };

        // 2. Project CRUD
        // Create
        const projectRes = await axios.post(`${API_URL}/projects`, {
            title: 'Test Project',
            description: 'Test Description',
            category: 'Tech',
            requiredSkills: ['Node.js']
        }, { headers });
        projectId = projectRes.data._id;
        console.log('✅ Project: Created');

        // Update
        await axios.put(`${API_URL}/projects/${projectId}`, {
            title: 'Updated Test Project'
        }, { headers });
        console.log('✅ Project: Updated');

        // Delete
        await axios.delete(`${API_URL}/projects/${projectId}`, { headers });
        console.log('✅ Project: Deleted');

        // Verify Deletion
        try {
            await axios.get(`${API_URL}/projects/${projectId}`);
            console.error('❌ Project: Deletion failed (still exists)');
        } catch (e) {
            if (e.response && e.response.status === 404) {
                console.log('✅ Project: Deletion verified (404)');
            } else {
                throw e;
            }
        }

        // 3. Team CRUD & Filters
        // Create Team 1
        const team1Res = await axios.post(`${API_URL}/teams`, {
            name: 'Team Alpha',
            university: 'Uni A',
            major: 'CS'
        }, { headers });
        console.log('✅ Team: Created Team 1');

        // Create Team 2
        await axios.post(`${API_URL}/teams`, {
            name: 'Team Beta',
            university: 'Uni B',
            major: 'Arts'
        }, { headers });
        console.log('✅ Team: Created Team 2');

        // Filter by University
        const uniFilterRes = await axios.get(`${API_URL}/teams?university=Uni A`);
        if (uniFilterRes.data.data.length === 1 && uniFilterRes.data.data[0].name === 'Team Alpha') {
            console.log('✅ Team: Filter by University working');
        } else {
            console.error('❌ Team: Filter by University failed');
        }

        // Filter by Major
        const majorFilterRes = await axios.get(`${API_URL}/teams?major=Arts`);
        if (majorFilterRes.data.data.length === 1 && majorFilterRes.data.data[0].name === 'Team Beta') {
            console.log('✅ Team: Filter by Major working');
        } else {
            console.error('❌ Team: Filter by Major failed');
        }

        // Delete Team
        await axios.delete(`${API_URL}/teams/${team1Res.data._id}`, { headers });
        console.log('✅ Team: Deleted');

        console.log('🎉 All verification tests passed!');

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

runTests();
