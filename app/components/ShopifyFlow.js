import styles from "./form.module.css";
import { parseXML, parseCSV } from "../helpers/helpers";
import { useState } from 'react';

export default function WooCommerceFlow({ importableData, setImportableData }) {
    const [error, setError] = useState('');
    const [storeUrl, setStoreUrl] = useState('');
    const [currentStep, setCurrentStep] = useState(1);
    const [wpExportData, setWpExportData] = useState(null);
    return (
        <div className={styles.form}>            

            {currentStep === 1 && (
                <>
                    <h2>Shopify Import: Step 1</h2>
                    <p>To add your product's to Voiceflow's knowledge base, we'll need to export them as a CSV file. But first, we need your store's URL.</p>
                    <p>Enter your store's root URL below and click <strong>Next</strong>. For example, <em>example-store.ca</em> or <em>example-store.myshopify.com</em>.</p>
                    <br />

                    <form>
                        {error && <div className={styles.error}>{error}</div>}
                        <input 
                            type="text" 
                            required 
                            placeholder="my-really-cool-store.com"
                            value={storeUrl}
                            onChange={(e) => setStoreUrl(e.target.value)}
                        />
                        <button type="submit" onClick={(e) => {
                            e.preventDefault();

                            // Return an error if the URL is invalid
                            if (!storeUrl.includes('.')) { // This isn't great validation, but its good enough for now.
                                setError('⚠️ Invalid URL. Please enter a valid URL.');
                                return;
                            }

                            setError('');
                            // Standardize the URL by removing http://, https:// (to allow splitting), and anything after slashes
                            let standardizedUrl = storeUrl.replace(/^https?:\/\//, '');
                            standardizedUrl = standardizedUrl.split('/')[0];
                            standardizedUrl = 'https://' + standardizedUrl; // now, re-add https://

                            setCurrentStep(2);
                            setStoreUrl(standardizedUrl);
                        }}>
                            Next
                        </button>
                    </form>
                </>
            )}

            {currentStep === 2 && (
                <>
                    <h2>Shopify Import: Step 2</h2>
                    <p>Next, we'll need to export your Shopify products as a CSV file. To do this, open your Shopify dashboard and click on <strong>Products</strong> → <strong>Export</strong>.</p>

                    <img src="/export-instructions-shopify-1.png" alt="Shopify Export Instructions" />

                    <p>In the popup that appears, select which products you'd like to export. Then, set <em>Export as</em> to <strong>Plain CSV file</strong> and click <strong>Export products</strong>.</p>
                    
                    <img src="/export-instructions-shopify-2.png" alt="Shopify Export Instructions" />

                    <p>Shopify will send you an email when your export is ready. Once you've received the email, download the file and upload it below.</p>
                    <p>Before importing, you may wish to remove any non-public data from the CSV. Only the <em>Handle</em>, <em>Title</em> and <em>Body (HTML)</em> fields are required, but including other fields can make your agent more powerful.</p>

                    <img src="/export-instructions-shopify-3.png" alt="Shopify Export Instructions" />

                    <form>
                        {error && <div className={styles.error}>{error}</div>}
                        <input
                            type="file"
                            id="shopifyExport"
                            accept=".csv"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const csvContent = e.target.result;
                                        const shopifyProductData = parseCSV(csvContent);

                                        // Validate CSV has at least one row
                                        if (shopifyProductData.length === 0) {
                                            setError('⚠️ The CSV file appears to be empty. Please make sure your Shopify export contains product data.');
                                            e.target.value = '';
                                            return;
                                        }

                                        const missingFields = shopifyProductData.find(product => !product.hasOwnProperty('Handle') || !product.hasOwnProperty('Title') || !product.hasOwnProperty('Body (HTML)'));
                                        if (missingFields) {
                                            setError('⚠️ The CSV you imported doesn\'t seem to be a Shopify export. Please make sure you\'re importing the correct file.');
                                            e.target.value = '';
                                            return;
                                        }

                                        setError('');
                                        // Add link attribute to each product using store URL and handle
                                        const productsWithLinks = shopifyProductData.map(product => ({
                                            ...product,
                                            link: `${storeUrl}/products/${product.Handle}`
                                        }));

                                        setImportableData(productsWithLinks);

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