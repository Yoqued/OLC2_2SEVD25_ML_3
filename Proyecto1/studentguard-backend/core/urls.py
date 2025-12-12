from django.urls import path
from . import views

urlpatterns = [
    path('upload-csv/', views.upload_csv, name='upload_csv'),
    path('clean-data/', views.clean_data, name='clean_data'),
    path('train-model/', views.train_model, name='train_model'),
    path('metrics/', views.get_metrics, name='get_metrics'),
    path('tune-hyperparams/', views.tune_hyperparams, name='tune_hyperparams'),
    path('retrain/', views.retrain_model, name='retrain_model'),
    path('predict/', views.predict_risk, name='predict_risk'),
]

