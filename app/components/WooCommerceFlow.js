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
                    <h2>WooCommerce Import: Step 1</h2>
                    <p>First, we'll need to export our WooCommerce data so we can import it to Voiceflow. We'll need to do two different types of exports: a WordPress export and a WooCommerce export.</p>
                    
                    <p>Let's start with our WordPress export. Open wp-admin, then click on <strong>Tools</strong> → <strong>Export</strong>, then choose "Posts" and click "Download Export File".</p>

                    <img src="/export-instructions-woocommerce-1.png" alt="WooCommerce Export Instructions" />
                
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

            {currentStep === 2 && (
                <>
                    <h2>WooCommerce Import: Step 2</h2>
                    <p>Great! That WordPress XML export looks good.</p>
                    <p>Now let's get the WooCommerce product export. In wp-admin, to <strong>Products</strong> → <strong>All Products</strong> → <strong>Export</strong>.</p>
                    
                    <img src="/export-instructions-woocommerce-2.png" alt="WooCommerce Export Instructions" />

                    <p>Then, select the fields and product types you'd like to export. <strong>You must include the <em>ID</em> and <em>Published</em> fields in your export. Then, click <strong>Generate CSV</strong>.</strong></p>
                    
                    <img src="/export-instructions-woocommerce-3.png" alt="WooCommerce Export Instructions" />

                    <p>Upload the CSV file you just downloaded below. Please note that variations are not currently supported by this importer and require you to do a custom import into Voiceflow. Variations inside your CSV will be ignored.</p>

                    <form>
                        {error && <div className={styles.error}>{error}</div>}
                        <input
                            type="file"
                            id="wooCommerceExport"
                            accept=".csv"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (e) => {
                                        const csvContent = e.target.result;
                                        const wcProductData = parseCSV(csvContent);

                                        // Validate CSV has at least one row
                                        if (wcProductData.length === 0) {
                                            setError('⚠️ The CSV file appears to be empty. Please make sure your WooCommerce export contains product data.');
                                            e.target.value = '';
                                            return;
                                        }

                                        // Validate each product has ID and Published fields
                                        const missingFields = wcProductData.find(product => !product.ID || !product.Published);
                                        if (missingFields) {
                                            setError('⚠️ The CSV is missing required fields. Please make sure your export includes both the ID and Published fields.');
                                            e.target.value = '';
                                            return;
                                        }

                                        setError('');

                                        // Create a map of WordPress products by ID for quick lookup
                                        const wpProductsMap = wpExportData.channel.item.reduce((acc, item) => {
                                            acc[item['wp:post_id']] = item;
                                            return acc;
                                        }, {});

                                        // Merge WooCommerce products with WordPress data and filter out products without links
                                        const mergedProducts = wcProductData
                                            .map(wcProduct => {
                                                const link = wpProductsMap[wcProduct.ID]?.link;
                                                if (!link) return null;
                                                
                                                return {
                                                    ...wcProduct,
                                                    link
                                                };
                                            })
                                            .filter(product => product !== null);

                                        setImportableData(mergedProducts);
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