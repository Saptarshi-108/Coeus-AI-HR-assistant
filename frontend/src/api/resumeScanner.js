export async function uploadForRanking(jdFile, resumes, criteriaFile) {
  const formData = new FormData();
  formData.append("jd_file", jdFile);
  formData.append("criteria_file", criteriaFile);
  resumes.forEach((file) => formData.append("resumes", file));

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rank/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Ranking failed");
  const blob = await response.blob();
  return blob; // A ZIP file
}

export async function analyzeBias(jsonFile) {
  const formData = new FormData();
  formData.append("json_file", jsonFile);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/bias/`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Bias analysis failed");
  return await response.json();
}
