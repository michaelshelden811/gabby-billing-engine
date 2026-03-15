import BillingUX from "../components/BillingUX";

export default function Page() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        padding: "10px",
        boxSizing: "border-box"
      }}
    >
      <BillingUX />
    </div>
  );
}
