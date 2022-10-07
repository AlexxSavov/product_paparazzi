import React from "react";
import Auth from "../utils/auth";
import { useQuery } from "@apollo/client";
import { QUERY_ME_BASIC } from "../utils/queries";
import BackgroundImage from "../images/shopcartaisle.jpeg";

const Home = () => {
	// const { loading, data } = useQuery(QUERY_THOUGHTS);
	const { data: userData } = useQuery(QUERY_ME_BASIC);

	// will import out photos here
	// const thoughts = data?.thoughts || [];

	const loggedIn = Auth.loggedIn();

	return (
		<main>
			<div className="col-12">
				{!loggedIn && (
					<div className=" myBackgroundImage">
						<img src={BackgroundImage} alt="shopping cart in aisle" />
					</div>
				)}

				{loggedIn && (
					<div className="col-12 mb-3">
						{/* <ThoughtForm /> */}
						<h1>Let's upload some photos!</h1>
					</div>
				)}
				<div className={`col-12 mb-3 ${loggedIn && "col-lg-8"}`}>
					{/* {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )} */}
				</div>
				{loggedIn && userData ? (
					<div className="col-12 col-lg-3 mb-3"></div>
				) : null}
			</div>
		</main>
	);
};

export default Home;
