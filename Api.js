const handleNextPress = async () => {
  try {
    const response = await fetch(
      "http://192.168.246.224:8082/api/auth/initiate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput, // From your text input
          password: passwordInput,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      console.log("Success:", data.message);
      // Navigate to OTP Screen here!
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error("Connection Error:", error);
  }
};
