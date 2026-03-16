import BillingUX from "../components/BillingUX";

export default function Page() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: "#0a0f1a",
        padding: "0px",
        margin: "0px",
      }}
    >
      <BillingUX />
    </div>
  );
}
