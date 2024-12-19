import styles from "./form.module.css";
import { parseXML, parseCSV } from "../helpers/helpers";
import { useState } from 'react';

export default function WooCommerceFlow({ importableData, setImportableData }) {
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [wpExportData, setWpExportData] = useState(null);
    return (
        <div className={styles.form}>            
            {currentStep === 1 && (
                <>
                    <h2>Shopify Import: Step 1</h2>
                    <p>We'll need to export your Shopify products as a CSV file so we can import them to Voiceflow. To export your product data, open your Shopify dashboard </p>

                    <form>
                        {error && <div className={styles.error}>{error}</div>}
                        <input
                            type="file"
                            id="postsExport"
                            accept=".xml"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const xmlContent = e.target.result;
                                        let wpExport = parseXML(xmlContent);
                                        
                                        if (!wpExport['@xmlns:wp']) {
                                            setError('⚠️ Invalid WordPress export file. Please make sure you are uploading a WordPress export file.');
                                            e.target.value = '';
                                            return;
                                        }
                                        
                                        setError('');
                                        setWpExportData(wpExport);
                                        setCurrentStep(2);
                                    };
                                    reader.readAsText(file);
                                }
                            }}
                        />
                    </form>
                </>
            )}
        </div>
    );
} 