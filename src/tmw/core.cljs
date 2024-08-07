(ns tmw.core
    (:require
      [clojure.string :as s]
      [reagent.core :as r]
      [reagent.dom :as d]
      [re-frame.core :refer [dispatch subscribe reg-sub reg-event-fx reg-event-db]]
      [kee-frame.core :as k]))

;; -------------------------
;; Views



(def join_name (r/atom ""))

(def host_name (r/atom ""))

(def current_code_text (r/atom ""))

(def game_code (r/atom ""))

(def num_players (r/atom 0))


;; players = [{:name "Jeff"} {:name "James"}]


(reg-sub :route-name 
         (fn [db]
           (-> db :kee-frame/route :data :name)))

(reg-event-fx :start-game
              (fn [{:keys [db]} [_ code]]
                {:db (assoc-in db [:players @num_players] {:name @host_name})
                 :navigate-to [:game {:code code}]}))

(reg-event-fx :join-game
              (fn [{:keys [db]} [_ code]]
                {:db (assoc-in db [:players @num_players] {:name @join_name})
                 :navigate-to [:game {:code code}]}))

(reg-sub :players
         (fn [db _]
           (:players db)))




(comment "Player map template

         :name 'Jeff'
         :id 1


join_name



         ")











;; This atom needs to be hooked up to the server
(def active_games (r/atom {}))

;; Functions

(defn log [x]
  (.log js/console x))

(def alphabet ["A" "B" "C" "D" "E" "F" "G" "H" "I" "J" "K" "L" "M" "N" "O" "P" "Q" "R" "S" "T" "U" "V" "W" "X" "Y" "Z"])

(defn generate_code []
  (clojure.string/join [(rand-nth alphabet) (rand-nth alphabet) (rand-nth alphabet) (rand-nth alphabet)]))

(defn join_btn_press []
  (let [code (s/upper-case @current_code_text)]
  (when (contains? @active_games (keyword code))
    (do 
      (reset! game_code code)
      (swap! num_players inc)
      (dispatch [:join-game code])))))

(defn host_btn_press []
  (let [code (generate_code)]
    (swap! active_games conj [(keyword code) code])
    (reset! game_code code)
    (swap! num_players inc)
    (dispatch [:start-game code])))

(defn name_change_join [e]
  (let [text (.-value (.-target e))]
    (reset! join_name text)))

(defn name_change_host [e]
  (let [text (.-value (.-target e))]
    (reset! host_name text)))

(defn code_change [e]
  (let [text (.-value (.-target e))]
    (reset! current_code_text text)))

;; Components

(defn title_cpt []
  [:h1 "That's My Word"])

(defn join_text_cpt []
  [:h3 "Join Game"])

(defn code_input_cpt []
  [:input.gc_input
   {:type "text" :placeholder "Game Code"
    :on-change code_change
    :max-length "4"
    :pattern "[A-Za-z]{4}"
    :style {:text-transform "uppercase"}}])

(defn name_input_join_cpt []
  [:input.name_input_join
   {:type "text" :placeholder "Player Name"
    :pattern "[a-zA-Z0-9]+"
    :on-change name_change_join}])

(defn name_input_host_cpt []
  [:input.name_input_host
   {:type "text" :placeholder "Player Name"
    :pattern "[a-zA-Z0-9]+"   
    :on-change name_change_host}])

(defn join_btn_cpt []
  [:input.join_btn
   {:type "button" :value "Go!"
    :on-click join_btn_press
    :style {:width "100px"}
    :disabled (or (= (count @join_name) 0) (not= (count @current_code_text) 4))}])

(defn host_text_cpt []
  [:h3 "Host Game"])

(defn host_btn_cpt []
  [:input.host_btn
   {:type "button" :value "Go!"
    :on-click host_btn_press
    :style {:width "100px"}
    :disabled (= (count @host_name ) 0)}])



;; Containers

(defn join_container []
 [:div
  [join_text_cpt]
  [code_input_cpt]
  [:br]
  [name_input_join_cpt]
  [:br] [:br]
  [join_btn_cpt]])

(defn host_container []
 [:div
  [host_text_cpt]
  [name_input_host_cpt]
  [:br] [:br]
  [host_btn_cpt]])

(defn home_container []
  [:div
   [title_cpt]
   [join_container]
   [:br][:br][:br][:br]
   [host_container]])













;; ------------- Ingame ---------------

(defn ingame_container []
  [:div
   [:h3.ingame-code-text (str "Code: " @game_code)]
   [:p.players-list-label "Players:"]
   (js/alert @(subscribe [:players]))
   [:p.players-list @(subscribe [:players])]])
;; dynamically add text elements for each player









;; ------------- Main -----------------

(defn main []
  (let [route (subscribe [:route-name])]
    (fn []
      (case @route
        :home [home_container]
        :game [ingame_container]
        [:div "Loading..."]
        )))
)

;; -------------------------
;; Initialize app

(defn mount-root []
 (k/start! {:debug?         true
           :routes         [["/" :home]
                            ["/game/:code" :game]]
           :initial-db     {:testing true}
           :root-component [main]})
 )

(defn ^:export init! []
  (mount-root))
