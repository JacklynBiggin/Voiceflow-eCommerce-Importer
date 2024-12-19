import styles from "./form.module.css";
import { useState } from 'react';

export default function VoiceflowImportFlow({ importableData, setSuccess }) {
    const [error, setError] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {

            // Generate headings for Voiceflow's API
            // Just in case an export is weird and has mismatched fields for products, we'll
            // ensure our headings contain all the possible fields.
            
            const headings = [...new Set(
                importableData.flatMap(item => Object.keys(item))
            )];

            console.log(apiKey);
        
            const response = await fetch('https://api.voiceflow.com/v1/knowledge-base/docs/upload/table?overwrite=true', {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: apiKey
                },
                body: JSON.stringify({
                    data: {
                        name: 'products',
                        schema: {
                            searchableFields: headings,
                            metadataFields: []
                        },
                        items: importableData
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message === 'Unauthorized' 
                    ? 'Invalid API key. Please check your API key and try again.'
                    : (errorData.message || 'Import failed');
                throw new Error(errorMessage);
            }

            // Handle successful import
            setSuccess(true);

        } catch (error) {
            setError(error.message || 'Import failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles.form} ${styles.info}`}>
            <h2>Import to Voiceflow</h2>
            <p>✅ Your product data looks good! Now let's import it into Voiceflow.</p>
            <p>Open the Voiceflow project that you'd like to import these products into. Then, click the <strong>Integration</strong> option on the sidebar and select <strong>API keys</strong>. Copy your API key and paste it into the field below.</p>

            <img src="/import-instructions.png" alt="Voiceflow Import Instructions" />

            <form className={styles.apiForm} onSubmit={handleSubmit}>
                {error && <div className={styles.error}>{error}</div>}
                <input 
                    type="text" 
                    required 
                    placeholder="Voiceflow API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Importing...' : 'Import'}
                </button>
            </form>
        </div>
    );
} 