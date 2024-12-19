import styles from "./form.module.css";

export default function ShopifyFlow() {
    return (
        <div className={styles.form}>
            <h2>Shopify Integration</h2>
            <form>
                <div className={styles.formGroup}>
                    <label htmlFor="shopifyStore">Shopify Store URL</label>
                    <input 
                        type="text" 
                        id="shopifyStore"
                        placeholder="your-store.myshopify.com"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="accessToken">Access Token</label>
                    <input 
                        type="password" 
                        id="accessToken"
                        placeholder="Enter your Shopify access token"
                    />
                </div>
                <button type="submit">Connect Shopify Store</button>
            </form>
        </div>
    );
} 