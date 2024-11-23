import React, { useState } from "react";
import { useHistory } from "react-router-dom"; 

function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const handleSignUp = async (event) => {
        event.preventDefault();
        // Kullanıcı kaydını API aracılığıyla yapacağız
        console.log("SignUp attempted with", email, password);
        // Başarılı kayıt sonrası login sayfasına yönlendirme
        history.push("/login");
    };

    return (
        <div className="signup">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignUp}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
}

export default SignUp;
