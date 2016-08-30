(ns photo-api.core
  (:gen-class)
  (:use compojure.core
        org.httpkit.server)
  (:require [compojure.handler :refer [site]]
            [compojure.route :refer [not-found]]
            [environ.core :refer [env]]
            [ring.middleware.json :refer [wrap-json-response]]
            [ring.middleware.cors :refer [wrap-cors]]
            [photo-api.services.request-parser :as parser]
            [photo-api.services.logger :as logger]
            [photo-api.services.response :refer [->json]]
            [photo-api.api :as api]))

(defroutes app-routes
  (HEAD "/" [] "")
  (GET "/healthcheck" [] (->json {:system "OK"}))
  (context "/api" [] api/core)
  (not-found (->json {:message "Unknown resource"} 404)))

(def app
  (-> app-routes
    (wrap-json-response)
    (parser/parse-query)
    (parser/parse-body)
    (logger/inbound)
    (wrap-cors #".*")))

(defn -main [& args]
  (let [port (-> env (:port) (or 3000) (Integer.))]
    (run-server (site app) {:port port})
    (println (str "Server is listening on port: " port))))