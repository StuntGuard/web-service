import tf from "@tensorflow/tfjs-node";
import fs from "fs";

async function normalizeData(age, gender, height) {
  try {
    const scalerData = fs.readFileSync(
      "./tfjs_model/scaler_params.json",
      "utf8"
    );
    const scaler = JSON.parse(scalerData);

    const min_ = tf.tensor(scaler.data_min_);
    const scale_ = tf.tensor(scaler.data_max_);

    const inputData = tf.tensor([Number(age), Number(height)]);

    const scaledData = inputData.sub(min_).div(scale_);

    const [normalizedAge, normalizedHeight] = scaledData.arraySync();

    const genderFilter = {
      perempuan: 1,
      "laki-laki": 0,
    };

    const genderIndex = genderFilter[gender];

    min_.dispose();
    scale_.dispose();
    inputData.dispose();
    scaledData.dispose();

    return { normalizedAge, normalizedHeight, genderIndex };
  } catch (error) {
    console.error("Error loading scaler:", error);
  }
}

export async function predictData(model, { age, gender, height }) {
  try {
    const { normalizedAge, normalizedHeight, genderIndex } =
      await normalizeData(age, gender, height);

    console.log("normalizedAge", normalizedAge);
    console.log("normalizedHeight", normalizedHeight);

    const umurTensor = tf.tensor2d([[parseFloat(normalizedAge)]], [1, 1]);
    const Tinggi_BadanTensor = tf.tensor2d(
      [[parseFloat(normalizedHeight)]],
      [1, 1]
    );
    const jenisKelaminTensor = tf.tensor2d([[parseFloat(genderIndex)]]);

    const inputTensors = [umurTensor, jenisKelaminTensor, Tinggi_BadanTensor];
    const prediction = await model.predict(inputTensors);

    const score = await prediction.data();

    const confidenceScore = Math.max(...score) * 100;

    const classes = ["Normal", "Tinggi", "Stunted", "Severely Stunted"];

    console.log("ini score", score);

    const result = tf.argMax(prediction, 1).dataSync()[0];

    const label = classes[result];

    return { label, confidenceScore };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
