import styles from "./page.module.css";
import Form from "./components/form.module.js";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <img src="/importer-logo.svg" alt="Voiceflow Importer" className={styles.logo} />
        <h1>eCommerce Product Importer</h1>

        <Form />

      </main>
      <footer className={styles.footer}>
        <a
          href="https://voiceflow.com"
          target="_blank"
        >
          ←	Back to Voiceflow
        </a>
      </footer>
    </div>
  );
}