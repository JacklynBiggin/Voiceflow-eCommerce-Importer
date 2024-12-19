"use client";
import { useState } from "react";
import styles from "./form.module.css";
import ShopifyFlow from "./ShopifyFlow";
import WooCommerceFlow from "./WooCommerceFlow";
import VoiceflowImportFlow from "./VoiceflowImportFlow";
import SuccessfulImport from "./SuccessfulImport";

export default function Form() {
    const [platform, setPlatform] = useState(null);
    const [importableData, setImportableData] = useState(null);
    const [success, setSuccess] = useState(false);

    if (success) {
        return <SuccessfulImport />;
    }

    if (importableData !== null) {
        return <VoiceflowImportFlow
        importableData={importableData}
        setSuccess={setSuccess}
        />;
    }

    if (platform === 'shopify') {
        return <ShopifyFlow
        setImportableData={setImportableData}
/>;
    }

    if (platform === 'woocommerce') {
        return <WooCommerceFlow 
            setImportableData={setImportableData}
        />;
    }

    return (
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="platform">Select your platform:</label>
          <div className={styles.platformButtons}>
            <button
              type="button"
              className={styles.button}
              onClick={() => setPlatform('shopify')}
            >
              <img src="/shopify.svg" alt="" />
            </button>
            <button
              type="button"
              className={styles.button}
              onClick={() => setPlatform('woocommerce')}
            >
              <img src="/woocommerce.svg" alt="" />
            </button>
          </div>
        </div>
      </form>
    );
}
  