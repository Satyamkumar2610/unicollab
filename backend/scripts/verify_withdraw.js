const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:3001/api';

async function runTests() {
    try {
        console.log('Starting withdraw request verification...');

        // 1. Register Owner
        const emailOwner = `owner_${Date.now()}@example.com`;
        const ownerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Owner',
            email: emailOwner,
            password: 'password123',
            university: 'Uni A',
            major: 'CS'
        });
        const tokenOwner = ownerRes.data.token;
        const headersOwner = { Authorization: `Bearer ${tokenOwner}` };
        console.log('✅ Owner registered');

        // 2. Register Requester
        const emailRequester = `requester_${Date.now()}@example.com`;
        const requesterRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Requester',
            email: emailRequester,
            password: 'password123',
            university: 'Uni B',
            major: 'CS'
        });
        const tokenRequester = requesterRes.data.token;
        const headersRequester = { Authorization: `Bearer ${tokenRequester}` };
        console.log('✅ Requester registered');

        // 3. Owner creates Project
        const projectRes = await axios.post(`${API_URL}/projects`, {
            title: 'Withdraw Test Project',
            description: 'Test Description',
            category: 'Tech',
            requiredSkills: ['JS'],
            status: 'active'
        }, { headers: headersOwner });
        const projectId = projectRes.data._id;
        console.log('✅ Project created');

        // 4. Requester sends request
        const requestRes = await axios.post(`${API_URL}/collaboration-requests`, {
            projectId: projectId,
            message: 'Let me join!'
        }, { headers: headersRequester });
        const requestId = requestRes.data._id;
        console.log('✅ Request sent');

        // 5. Verify Request is in Sent list
        const sentRequests = await axios.get(`${API_URL}/collaboration-requests?type=sent`, { headers: headersRequester });
        if (sentRequests.data.data.some(r => r._id === requestId)) {
            console.log('✅ Verification: Request found in sent list');
        } else {
            console.error('❌ Verification Failed: Request not found in sent list');
        }

        // 6. Requester withdraws request
        await axios.delete(`${API_URL}/collaboration-requests/${requestId}`, { headers: headersRequester });
        console.log('✅ Request withdrawn');

        // 7. Verify Request is gone
        const sentRequestsAfter = await axios.get(`${API_URL}/collaboration-requests?type=sent`, { headers: headersRequester });
        if (!sentRequestsAfter.data.data.some(r => r._id === requestId)) {
            console.log('✅ Verification: Request successfully removed');
        } else {
            console.error('❌ Verification Failed: Request still in list');
        }

    } catch (error) {
        console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    }
}

runTests();
