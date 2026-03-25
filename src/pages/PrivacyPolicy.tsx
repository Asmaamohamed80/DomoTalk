const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background p-6 max-w-2xl mx-auto">
    <h1 className="font-display text-2xl font-bold mb-6">Privacy Policy</h1>
    <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2 className="text-foreground font-semibold text-base mt-6">1. Data Collection</h2>
      <p>We collect minimal data necessary to provide our service. File uploads are processed locally and are not stored on our servers.</p>
      <h2 className="text-foreground font-semibold text-base mt-6">2. Points & Progress</h2>
      <p>Your points and level progress are stored locally on your device. When signed in, they may sync to our database.</p>
      <h2 className="text-foreground font-semibold text-base mt-6">3. AI Analysis</h2>
      <p>Data sent for AI analysis is processed in real-time and not retained after the session ends.</p>
      <h2 className="text-foreground font-semibold text-base mt-6">4. Contact</h2>
      <p>For privacy concerns, contact us through the Report Content feature in Settings.</p>
    </div>
    <a href="/" className="inline-block mt-8 text-primary text-sm font-medium hover:underline">← Back to App</a>
  </div>
);

export default PrivacyPolicy;
