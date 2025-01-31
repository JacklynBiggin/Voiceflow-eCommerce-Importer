export async function POST(req) {
    const body = await req.json();
    
    const data = {
        event: body.event,
        properties: {
            ...body.properties,
            token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN,
            time: Math.floor(Date.now() / 1000)
        }
    };

    const options = {
        method: 'POST',
        headers: {
            'accept': 'text/plain',
            'content-type': 'application/json'
        },
        body: JSON.stringify([data])
    };

    try {
        const response = await fetch('https://api.mixpanel.com/track', options);
        const result = await response.text();
        return new Response(result, { status: 200 });
    } catch (error) {
        console.error('Mixpanel API Error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
