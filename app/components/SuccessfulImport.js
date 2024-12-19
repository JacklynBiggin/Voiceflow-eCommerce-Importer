import styles from './form.module.css';

export default function SuccessfulImport() {
    return (
        <>
            <div className={`${styles.form} ${styles.success}`}>
                <h2>Import Successful!</h2>
                <div className={styles.imgContainer}>
                    <img src="/success.svg" alt="Success" />
                </div>
                <p>Your data has been successfully imported to Voiceflow. Refresh the knowledge base page to see your new products.</p>
                <p>Need to update your data in the future? Visit this importer again and re-run the import and we'll update it for you!</p>
            </div>
            <div className={`${styles.form} ${styles.info}`}>
                <p><strong>Technical and want to build your own importer?</strong> This tool was built using the <a href="https://docs.voiceflow.com/reference/post_v1-knowledge-base-docs-upload-table-1" target="_blank">Voiceflow Knowledge Base API</a>!</p>
            </div>
        </>
    );
} 