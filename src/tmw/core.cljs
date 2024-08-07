(ns tmw.core
  (:require
   [re-frame.core :refer [dispatch subscribe reg-sub reg-event-fx reg-event-db]]
   [kee-frame.core :as k]
   [tmw.data :as data]
   [tmw.home :as home]
   [tmw.lobby :as lobby]
   [tmw.game :as game]
   [lambdaisland.fetch :as fetch]
   [promesa.core :as p]))



(reg-sub :route-name
         (fn [db]
           (-> db :kee-frame/route :data :name)))

(reg-event-fx :start-game
              (fn [{:keys [db]} [_ code]]
                {:db (assoc-in db [:players @data/num_players] {:name @data/host_name})
                 :navigate-to [:lobby {:code code}]}))

(reg-event-fx :join-game
              (fn [{:keys [db]} [_ code]]
                {:db (assoc-in db [:players @data/num_players] {:name @data/join_name})
                 :navigate-to [:lobby {:code code}]}))

(reg-event-fx :start-playing
              (fn [{:keys [db]} [_ code]]
                {:navigate-to [:playing {:code code}]}))




(reg-sub :players
         (fn [db _]
           (:players db)))





;; Functions

(defn log [x]
  (.log  js/console x))




;; ----------- Ingame -----------------








;; ------------- Main -----------------

(defn main []

  (p/let [resp (fetch/get "/Prompts.json")
          prompts (:body resp)]
    (reset! data/prompts (clj->js prompts)))
  (let [route (subscribe [:route-name])]
    (fn []
      (case @route
        :home [home/home_container]
        :lobby [lobby/lobby_container]
        :playing [game/ingame_container]
        [:div "Loading..."]))))

;; -------------------------
;; Initialize app

(defn mount-root []
  (k/start! {:debug?         true
             :routes         [["/" :home]
                              ["/game/:code" :lobby]
                              ["/game/:code/play" :playing]]
             :initial-db     {:testing true}
             :root-component [main]}))

(defn ^:export init! []
  (mount-root))
