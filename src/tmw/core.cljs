(ns tmw.core
    (:require
      [reagent.core :as r]
      [reagent.dom :as d]))

;; -------------------------
;; Views


;; Atoms

(def join_name (r/atom ""))

(def host_name (r/atom ""))

(def current_code (r/atom ""))


;; This atom needs to be hooked up to the server
(def active_games (r/atom []))

;; Functions

(defn log [x]
  (.log js/console x))


(def alphabet ["A" "B" "C" "D" "E" "F" "G" "H" "I" "J" "K" "L" "M" "N" "O" "P" "Q" "R" "S" "T" "U" "V" "W" "X" "Y" "Z"])

(defn generate_code []
  (clojure.string/join [(rand-nth alphabet) (rand-nth alphabet) (rand-nth alphabet) (rand-nth alphabet)]))
(defn join_btn_press []
  (log @current_code)
  (log (some? (some #{@current_code} @active_games)))
  (log @active_games)
  (log ["press"])
)

(defn host_btn_press []
  (let [code (generate_code)]
    (swap! active_games conj code)
    (log code)))
;;go into the game here

(defn name_change_join [e]
  (let [text (.-value (.-target e))]
    (reset! join_name text)))

(defn name_change_host [e]
  (let [text (.-value (.-target e))]
    (reset! host_name text)))

(defn code_change [e]
  (let [text (.-value (.-target e))]
    (reset! current_code text)))

;; Components

(defn title_cpt []
  [:h1 "That's My Word"])

(defn join_text_cpt []
  [:h3 "Join Game"])

(defn code_input_cpt []
  [:input.gc_input
   {:type "text" :placeholder "Game Code"
    :on-change code_change}])

(defn name_input_join_cpt []
  [:input.name_input_join
   {:type "text" :placeholder "Player Name"
    :on-change name_change_join}])

(defn name_input_host_cpt []
  [:input.name_input_host
   {:type "text" :placeholder "Player Name"
    :on-change name_change_host}])

(defn join_btn_cpt []
  [:input.join_btn
   {:type "button" :value "Go!"
    :on-click join_btn_press
    :style {:width "100px"}
    :disabled (or (= (count @join_name) 0) (not= (count @current_code) 4))}])

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

;; Main

(defn main []
  [:div
   [title_cpt]
   [join_container]
   [:br] [:br] [:br] [:br]
   [host_container]
])

;; -------------------------
;; Initialize app

(defn mount-root []
  (d/render [main] (.getElementById js/document "app")))

(defn ^:export init! []
  (mount-root))
