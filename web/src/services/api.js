const API_URL = 'http://localhost:8000';

export const getStories = async (token) => {
    // const response = await fetch(`${API_URL}/stories`, {
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //     },
    // });

    const response = {
        "ok": true,
        "stories": [
            {
                "id": "1",
                "title": "Sample Story",
                "createdAt": "2023-10-01T12:00:00Z",
                "pages": [
                    {
                        "id": "1",
                        "content": "Once upon a time...",
                        "order": 1
                    },
                    {
                        "id": "2",
                        "content": "And they lived happily ever after.",
                        "order": 2
                    }
                ]
            }]
    };

    if (!response.ok) {
        throw new Error('Failed to fetch stories');
    }

    return response.stories;
};

export const getStory = async (token, storyId) => {
    const response = await fetch(`${API_URL}/stories/${storyId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch story');
    }

    return response.json();
};
