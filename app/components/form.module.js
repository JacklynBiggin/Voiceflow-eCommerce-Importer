"use client";
import { useState } from "react";
import styles from "./form.module.css";
import ShopifyFlow from "./ShopifyFlow";
import WooCommerceFlow from "./WooCommerceFlow";
import VoiceflowImportFlow from "./VoiceflowImportFlow";
import SuccessfulImport from "./SuccessfulImport";
import { trackPlatformSelection } from '../helpers/mixpanel';

export default function Form() {
    const [platform, setPlatform] = useState(null);
    const [importableData, setImportableData] = useState(null);
    const [success, setSuccess] = useState(false);

    if (success) {
        return <SuccessfulImport />;
    }

    if (importableData) {
        return <VoiceflowImportFlow
            importableData={importableData}
            setSuccess={setSuccess}
        />;
    }

    if (platform === 'shopify') {
        return <ShopifyFlow
            setImportableData={setImportableData}
            platform={platform}
        />;
    }

    if (platform === 'woocommerce') {
        return <WooCommerceFlow 
            setImportableData={setImportableData}
            platform={platform}
        />;
    }

    return (
        <div className={styles.form}>
            <h2>Select your platform:</h2>
            <div className={styles.platforms}>
                <button
                    onClick={() => {
                        setPlatform('shopify');
                        trackPlatformSelection('shopify');
                    }}
                >
                    <img src="/shopify.svg" alt="Shopify" />
                </button>
                <button
                    onClick={() => {
                        setPlatform('woocommerce');
                        trackPlatformSelection('woocommerce');
                    }}
                >
                    <img src="/woocommerce.svg" alt="WooCommerce" />
                </button>
            </div>
        </div>
    );
}
  