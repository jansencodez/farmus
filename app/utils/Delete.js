const handleDeleteProduct = async (
  productId: string,
  checkAuthStatus,
  isDeleting
) => {
  try {
    setIsDeleting(true);
    const token = checkAuthStatus; // Fetch the token from auth context
    if (token) {
      const response = await fetchWithTokenRefresh(
        `${baseUrl}/delete?id=${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== productId));
        setIsDeleting(false);
        ToastAndroid.show("successful", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("not successful", ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show("not signed in", ToastAndroid.SHORT);
    }
  } catch (error) {
    ToastAndroid.show("failed", ToastAndroid.SHORT);
  }
};

export default handleDeleteProduct;
