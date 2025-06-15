const API_URL = 'https://j0vecnx5vh.execute-api.us-east-2.amazonaws.com/Prod';

export const authenticateUser = async (username, magicNumber) => {
    try {
        const response = await fetch(`${API_URL}/Login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                magic_number: magicNumber
            })
        });

        const data = await response.json();
        
        // API Gateway returns response wrapped in body
        if (data.body) {
            const parsedBody = JSON.parse(data.body);
            return {
                token: parsedBody.token,
                username: parsedBody.username
            };
        }
        
        return {
            token: data.token,
            username: data.username
        };
    } catch (error) {
        console.error('Error authenticating:', error);
        throw new Error('Authentication failed');
    }
}

export const getStories = async (token, username) => {    try {
        const response = await fetch(`${API_URL}/GetStories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                username: username
            })
        });

        const data = await response.json();
        
        // API Gateway returns response wrapped in body
        if (data.body) {
            const parsedBody = JSON.parse(data.body);
            return parsedBody.stories || [];
        }
        
        return data.stories || [];
    } catch (error) {
        console.error('Error fetching stories:', error);
        throw error;
    }
};

export const getStory = async (token, storyId) => {
    try {
        const response = await fetch(`${API_URL}/GetStory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                storyId: storyId
            })
        });

        const data = await response.json();
        
        // API Gateway returns response wrapped in body
        if (data.body) {
            return JSON.parse(data.body);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching story:', error);
        throw new Error('Failed to fetch story');
    }
};
