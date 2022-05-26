import numpy as np
import pandas as pd
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn import metrics
import pickle
from sklearn.model_selection import GridSearchCV
from sklearn.model_selection import RepeatedStratifiedKFold

data = pd.read_csv("./Training_Data_BTP.csv")

X=data.iloc[:,0:39]
Y=data.iloc[:,39:40]
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2,random_state=2123)
# param_grid = {'C': [1], 'gamma': [0.01,1,10],'kernel': ['poly'], 'degree':[3]}
# cv = RepeatedStratifiedKFold(n_splits=10, n_repeats=1, random_state=12)
# grid = GridSearchCV(SVC(),param_grid,refit=True,verbose=3,n_jobs=-1, cv=cv, scoring='accuracy',error_score=0)
# grid.fit(X,Y.values.ravel())
# print("Best: %f using %s" % (grid.best_score_, grid.best_params_))
Classifier = SVC(kernel='poly', C=1, gamma=0.01, degree=3)
Classifier.fit(X,Y.values.ravel())
pickle.dump(Classifier, open("Voice_Disorder_Model1.sav", 'wb'))
Y_pred=Classifier.predict(X_test)
print(Y_pred)
print("Accuracy:",metrics.accuracy_score(Y_test, Y_pred))

