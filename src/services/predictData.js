import tf from "@tensorflow/tfjs-node";

function normalizeData(age, gender, height) {
  const normalizedAge = (Number(age) - 0) / (60 - 0);
  const normalizedHeight = (Number(height) - 40) / (128 - 40);

  const genderFilter = {
    perempuan: 1,
    "laki-laki": 0,
  };

  const genderIndex = genderFilter[gender];

  return { normalizedAge, normalizedHeight, genderIndex };
}

export async function predictData(model, { age, gender, height }) {
  try {
    const { normalizedAge, normalizedHeight, genderIndex } = normalizeData(
      age,
      gender,
      height
    );

    const umurTensor = tf.tensor2d([[parseFloat(normalizedAge)]], [1, 1]);
    const Tinggi_BadanTensor = tf.tensor2d(
      [[parseFloat(normalizedHeight)]],
      [1, 1]
    );
    const jenisKelaminTensor = tf.tensor2d([[parseFloat(genderIndex)]]);

    const inputTensors = [umurTensor, jenisKelaminTensor, Tinggi_BadanTensor];
    const prediction = await model.predict(inputTensors);

    const score = await prediction.data();
    console.log(score);
    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Normal", "Tinggi", "Stunted", "Severely Stunted"];

    const result = tf.argMax(prediction, 1).dataSync()[0];

    const label = classes[result];

    return { label, confidenceScore };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
