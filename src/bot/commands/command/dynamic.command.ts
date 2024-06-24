export const cleanAndExtractValidWords = (arr) => {
  const validWords = arr.filter((item) => {
    const cleanedItem = item.replace(/[<>@]/g, "");
    return /[a-zA-Zàáạảãăắằẵặẳâấầẩẫậđèéẹẻẽêềếểễệìíịỉĩòóọỏõôốồổỗộơớờởỡợùúụủũưứừửữựỳỵỷỹý]/.test(
      cleanedItem
    );
  });

  return validWords.join(" ");
};
