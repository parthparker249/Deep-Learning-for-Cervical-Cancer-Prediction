# Cervical Cancer Biopsy Risk Prediction using Deep Learning

![image](https://github.com/user-attachments/assets/2919795c-36cd-4ee7-8d30-3bce2c57ec13)

**Link to our Screening Website:** https://script.google.com/a/macros/wm.edu/s/AKfycbyk-xGFspIH-SqU0W-LScFi4Keipyrf1O9tvhNyczYUbqrwsu7NsSNbPRf5dxANMf1u/exec

**Dataset Source:** https://archive.ics.uci.edu/dataset/383/cervical+cancer+risk+factors

**Author List:** 

[-Parth Parker](https://github.com/parthparker249/parthparker249/blob/main/README.md)

[-Stefan](https://github.com/stefanngoh/stefanngoh/blob/main/README.md)

[-Max](https://github.com/maxpietrykowski/maxpietrykowski/blob/main/README.md)

[-Lucas](https://github.com/Lacarmichael/README.md/blob/main/README.md)

---


## OBJECTIVE
This project aims to develop a deep learning model to predict the likelihood of a positive cervical cancer biopsy based on clinical and behavioral risk factors. The model is intended to assist in early detection efforts and support medical decision-making.

## INTRODUCTION
In this project, we build a **deep learning classification model** to predict biopsy outcomes using a dataset of 858 patients. The dataset includes features such as demographic information, sexual behavior, contraceptive use, smoking habits, and prior STD history.

Cervical cancer remains a major global health issue. HPV (Human papillomavirus) is identified as the leading risk factor. Other contributing factors include smoking, contraceptive use, and weakened immune systems (e.g., due to HIV/AIDS).

## MODEL DESCRIPTION
### Architecture
- **Model Type:** Sequential Neural Network (Keras)
- **Input Layer:** 62 features (after preprocessing)
- **Hidden Layers:**
  - Dense (10 neurons, ReLU)
  - Dense (8 neurons, ReLU)
- **Output Layer:** Dense (2 neurons, Softmax for binary classification)

### Training Details
- **Loss Function:** Categorical Crossentropy
- **Optimizer:** Adam
- **Epochs:** 200
- **Validation Split:** 20%

### Preprocessing
- Replaced missing values with column means
- Applied one-hot encoding for categorical variables
- Used StandardScaler to normalize numerical features

## FEATURES
- Built and trained a neural network using Keras and TensorFlow
- Preprocessed data using pandas, NumPy, and scikit-learn
- Scaled features and encoded categorical data
- Evaluated model using accuracy and ROC AUC
- Visualized model performance and feature importance

## TECHNOLOGIES USED
- Python
- TensorFlow / Keras
- Scikit-Learn
- Pandas / NumPy
- Matplotlib / Seaborn
- Jupyter Notebooks

## USAGE
### Step-by-step Breakdown:
1. **Load and Clean Dataset**
2. **Handle Missing Values**
3. **Encode Categorical Variables**
4. **Split and Standardize Data**
5. **Build Deep Learning Model**
6. **Train and Validate Model**
7. **Evaluate Model Performance**
8. **Visualize Feature Importances**

## NOTABLE INSIGHTS
- Key Predictive Features: HPV presence, number of sexual partners, STD history, smoking habits
- High classification accuracy (approx. 95% on test data)
- Consistent validation curves with low overfitting

## RESPONSIBLE AI CONSIDERATIONS
Building AI solutions in the healthcare domain requires a deep commitment to ethical and responsible development. This model incorporates several key Responsible AI principles:

⚖️ Fairness
The dataset was carefully preprocessed to minimize bias caused by missing or skewed data. 

However, due to geographical, demographic, and socioeconomic limitations of the source data (patients from a single hospital in Venezuela), the model may not generalize well across populations without further validation.

🔐 Privacy
Only de-identified, publicly available data was used.

All processing and modeling were done in accordance with ethical use of data for research and non-commercial purposes.

⚠️ Risk Mitigation
The model is intended as a decision-support tool, not a diagnostic authority.

False negatives (missed high-risk cases) are a key concern. Thresholds and risk scoring should be carefully managed in deployment settings.

📍 Accountability
Continuous monitoring and auditing of model performance is essential if deployed in real-world environments.

The development team holds responsibility for transparently communicating limitations and working closely with domain experts (e.g., gynecologists) for validation.

## CONCLUSION
This project successfully developed a neural network model for predicting biopsy outcomes related to cervical cancer risk. By analyzing clinical and behavioral data, the model demonstrated strong predictive performance and potential for integration into healthcare tools for early detection and prevention strategies.

## FUTURE WORK
- Incorporate SHAP for deeper model explainability
- Extend model for multi-class risk classification
- Fine-tune architecture and hyperparameters
- Explore integration with electronic health record systems

**"Early detection saves lives. Deep learning gives us a powerful tool to make that possible."**

## Research Citations
1. Gupta A, Parveen A, Kumar A, Yadav P. Advancement in Deep Learning Methods for Diagnosis and Prognosis of Cervical Cancer. Curr Genomics. 2022 Aug 11;23(4):234-245. doi: 10.2174/1389202923666220511155939. PMID: 36777879; PMCID: PMC9875539.

---

**Disclaimer:** This model is for educational and research purposes only. It should not be used for actual medical diagnosis without proper validation and regulatory approval.

