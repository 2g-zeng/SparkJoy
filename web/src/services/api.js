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
        let data = await response.json();

        // API Gateway returns response wrapped in body
        if (data.body) {
            const parsedBody = JSON.parse(data.body);
            if (!parsedBody.ok) {
                throw new Error(parsedBody.error || 'Authentication failed');
            }
            return {
                token: parsedBody.token,
                username: parsedBody.username
            };
        }
        
        if (!data.ok) {
            throw new Error(data.error || 'Authentication failed');
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

export const getStories = async (token, username) => {    
    try {
        const response = await fetch(`${API_URL}/GetStories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
                username: username,
                token: token
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

export const generateStory = async (token, instructions, images = [], username = null) => {
    try {
        // Convert images to base64 if they aren't already
        const processedImages = await Promise.all(
            images.map(async (img) => {
                if (typeof img === 'string' && img.startsWith('data:')) {
                    return img; // Already base64
                }
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(img);
                });
            })
        );

        const response = await fetch(`${API_URL}/GenerateStory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                token,
                username,
                instructions,
                images: processedImages
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate story');
        }

        const data = await response.json();
        
        // API Gateway returns response wrapped in body
        if (data.body) {
            const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
            return parsedBody.story;
        }
        
        return data.story;
    } catch (error) {
        console.error('Error generating story:', error);
        throw new Error(error.message || 'Failed to generate story');
    }
};

export const saveStory = async (token, story, username) => {
    try {
        const response = await fetch(`${API_URL}/SaveStory`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                token,
                story,
                username
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save story');
        }

        const data = await response.json();
        
        // API Gateway returns response wrapped in body
        if (data.body) {
            const parsedBody = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
            return parsedBody;
        }
        
        return data;
    } catch (error) {
        console.error('Error saving story:', error);
        throw new Error(error.message || 'Failed to save story');
    }
};
