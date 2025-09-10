export default function TermsOfServicePage() {
  return (
    <article>
      <h1>Terms of Service</h1>
      <p>By using our service, you agree to these terms. Please read them carefully.</p>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
    </article>
  );
}
