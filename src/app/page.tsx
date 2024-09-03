import { ConnectEmbed, ConnectButton } from "@/app/thirdweb";
import { client } from "./client";
import { chain } from "./chain";
import { Stake } from "../../components/Stake";

export default function Home() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      width: "100vw",
    }}>
      <div style={{ textAlign: "center"}}>
        <ConnectEmbed 
          client={client}
          chain={chain}
        />
        < Stake />
      </div>
    </div>
  );
}
