import styles from "./page.module.css";
import Form from "./components/form.module.js";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <img src="/importer-logo.svg" alt="Voiceflow Importer" className={styles.logo} />
        <h1>Import eCommerce Products</h1>

        <Form />

      </main>
      <footer className={styles.footer}>
        <p>Data is processed locally on your device until it is imported to Voiceflow. Once imported, it is subject to Voiceflow's <a href="https://www.voiceflow.com/legal/privacy" target="_blank">Privacy Policy</a> and <a href="https://www.voiceflow.com/legal/terms" target="_blank">Terms of Service</a>.</p>
      </footer>
    </div>
  );
}