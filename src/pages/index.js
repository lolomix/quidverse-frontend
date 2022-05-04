import { useEffect, useState } from "react";

// Components
import Famous from "../components/Famous";
import Family from "../components/Family";
import Project from "../components/Project";
import MintButton from "../components/MintButton";
import { Row, Col, Container } from "reactstrap";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";

import styles from "../styles/style.module.css";

import { DAppProvider } from "@usedapp/core";
import { useEthers } from "@usedapp/core";
import { getWeb3Auto, getWeb3, web3WalletConnectProvider } from "../util/web3";

function ConnectBtn({ web3, setWeb3 }) {
  const { activateBrowserWallet, account: _ } = useEthers();
  const [account, setAccount] = useState(_);

  const handleWallet = async (walletSource) => {
    try {
      if (walletSource === "wc") {
        if (web3WalletConnectProvider.connected) {
          await web3WalletConnectProvider.disconnect();
        }
        await web3WalletConnectProvider.enable();
      } else {
      }
      activateBrowserWallet();
    } catch (e) {
      web3WalletConnectProvider.close();
      alert("Unable to connect!");
      window.location.reload();
    }

    web3 = getWeb3(walletSource);

    setWeb3(web3);
  };

  useEffect(() => {
    (async () => {
      if (!web3) {
        alert("Please use desktop or DApp browser if you are not already.");
      } else if (!web3.currentProvider) {
        web3 = getWeb3();
      } else {
        web3.eth
          .getChainId()
          .then((e) => {
            if (Number(e) !== 1) {
              alert("Please switch to Ethereum mainnet in your wallet");
            }
          })
          .catch((err) => {
            console.log(err);
          });

        try {
          web3.currentProvider.on("chainChanged", (chainId) => {
            if (Number(chainId) !== 1) {
              alert("Please switch to Ethereum mainnet in your wallet");
            } else {
              window.location.reload();
            }
          });

          web3.currentProvider.on("accountsChanged", (accounts) => {
            setAccount(accounts && accounts.length && accounts[0]);
          });

          web3.currentProvider.on("disconnect", (code, reason) => {
            setAccount(null);
            web3WalletConnectProvider.close();
            window.location.reload();
          });
        } catch (e) {}

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts && accounts.length && accounts[0]);
      }
    })();
  }, [web3]);

  return (
    <div className="relative block p-1 font-bold display-hover-trigger md:bg-dark text-accent md:rounded-lg hover:bg-accent hover:text-darker">
      <p
        className={`${styles.btnConnect} font-bold bg-accent1 hover:text-accent1 hover:bg-accent2 transition duration-150 text-3xl md:text-2xl`}
      >
        {account ? `${account.slice(0, 6)}...${account.slice(-6)}` : "Connect"}
      </p>
      <div className="display-hover-target absolute bg-accent rounded-lg shadow-xl py-1.5 z-50">
        <button
          className={`${styles.btnConnect} font-bold bg-accent1 hover:text-accent1 hover:bg-accent2 transition duration-150 text-2xl md:text-xl`}
          onClick={() => handleWallet(null)}
        >
          Browser
        </button>
        <button
          className={`${styles.btnConnect} font-bold bg-accent1 hover:text-accent1 hover:bg-accent2 transition duration-150 text-2xl md:text-xl mt-1`}
          onClick={() => handleWallet("wc")}
        >
          WalletConnect
        </button>
      </div>
    </div>
  );
}

function Home() {
  const [web3, setWeb3] = useState(getWeb3Auto());

  useEffect(() => {
    setWeb3(getWeb3Auto());
  }, []);

  return (
    <DAppProvider>
      <Head>
        <link rel="icon" href="assets/images/favicon_cir.ico" />
        <title>Quid TKO v1</title>
        <meta
          name="facebook-domain-verification"
          content="7bq9sgv8kg7l9si53vaf7o01azcb57"
        />
      </Head>
      <div
        style={{
          backgroundColor: "#000014",
        }}
      >
        <div className={styles.backDiv}>
          <Container
            style={{
              margin: "0 auto",
              padding: "0 30px",
              marginBottom: "0px",
            }}
          >
            <header className={`${styles.navbar}`}>
              <div className="flex flex-row justify-between mt-6">
                <div className="hidden sm:flex">
                  <img
                    src="/assets/images/TKO_2.png"
                    style={{ height: "60px" }}
                  ></img>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  {/* <ul
                    className={styles.navUI}
                    data-sr-id="3"
                  >
                    <li style={{ marginRight: "30px" }}>
                      <Link href="/">
                        <label className={styles.navLabel}>Home</label>
                      </Link>
                    </li>
                    <li style={{ marginRight: "30px" }}>
                      <Link href="/">
                        <label className={styles.navLabel}>About</label>
                      </Link>
                    </li>
                    <li style={{ marginRight: "30px" }}>
                      <Link href="/">
                        <label className={styles.navLabel}>Best Moments</label>
                      </Link>
                    </li>
                    <li style={{ marginRight: "30px" }}>
                      <Link href="/">
                        <label className={styles.navLabel}>Family</label>
                      </Link>
                    </li>
                    <li style={{ marginRight: "30px" }}>
                      <Link href="/">
                        <label className={styles.navLabel}>FAQ</label>
                      </Link>
                    </li>
                  </ul> */}
                  <a
                    className="hidden md:inline-block text-accent5 hover:text-accent1 transition duration-150"
                    href="https://discord.gg/quidika"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current hover:fill-current transition duration-150"
                      viewBox="0 0 50 50"
                      width="24px"
                      height="24px"
                    >
                      <path d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z" />
                    </svg>
                  </a>
                  <a
                    className="hidden md:inline-block text-accent5 hover:text-accent1 transition duration-150"
                    href="https://facebook.com/groups/quidika"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current hover:fill-current transition duration-150"
                      viewBox="0 0 50 50"
                      width="24px"
                      height="24px"
                    >
                      <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z" />
                    </svg>
                  </a>
                  <a
                    className="hidden md:inline-block text-accent5 hover:text-accent1 transition duration-150"
                    href="https://twitter.com/quidikatoken"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="fill-current hover:fill-current transition duration-150"
                      viewBox="0 0 30 30"
                      width="24px"
                      height="24px"
                      margin="10px"
                    >
                      <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z" />
                    </svg>
                  </a>
                  <ConnectBtn web3={web3} setWeb3={setWeb3} />
                </div>
              </div>
            </header>
            <img
              src="/assets/images/TKO_COVER.jpeg"
              width="auto"
              className="w-full h-auto mt-6 mb-12 rounded-2xl"
            />
            <Famous />

            <MintButton web3={web3} />
            <div>
              <div className="mt-16">
                <div>
                  <p
                    style={{
                      color: "#fe6810",
                      fontSize: "20px",
                      fontStyle: "italic",
                      marginBottom: "0px",
                      marginTop: "0px",
                    }}
                  >
                    TKO
                  </p>
                  <p className={styles.knockouts}>TENTACLE KNOCKOUT:</p>
                  <p
                    style={{
                      color: "#fe6810",
                      fontSize: "29.5px",
                      marginBottom: "0",
                      marginTop: "-20px",
                    }}
                  >
                    UNLOCK THE YOOMOOTA
                  </p>
                </div>
                <p
                  style={{
                    color: "white",
                    fontSize: "20px",
                    marginTop: "20px",
                  }}
                >
                  1,000 collectible squid versus dog knockout scenes on the
                  Ethereum blockchain. Inspired by Ali vs Liston -- May 25,
                  1965. Unlock the YOOMOOTA. Made up of 144 traits with a few
                  being one of ones.
                </p>
              </div>
            </div>
            <div style={{ textAlign: "center" }}></div>
            <Family />
            <div className="flex flex-col space-y-4">
              <div>
                <p
                  style={{
                    color: "#fe6810",
                    fontSize: "30px",
                    fontStyle: "800",
                    marginBottom: "0px",
                    marginTop: "0px",
                  }}
                >
                  WELCOME TO THE YOOMOOTA
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:space-x-4 md:space-y-0 space-y-4 pb-16 md:mx-0 mx-auto">
                <img src="/assets/images/n1.png" className="w-72 h-auto" />
                <img src="/assets/images/n2.png" className="w-72 h-auto" />
                <img src="/assets/images/n3.png" className="w-72 h-auto" />
                <img src="/assets/images/n4.png" className="w-72 h-auto" />
              </div>
            </div>
          </Container>
        </div>
      </div>
    </DAppProvider>
  );
}

export default Home;
