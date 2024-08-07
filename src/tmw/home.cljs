(ns tmw.home
  (:require
   [clojure.string :as s]
   [re-frame.core :refer [dispatch]]
   [tmw.data :as data]))

(def alphabet ["A" "B" "C" "D" "E" "F" "G" "H" "I" "J" "K" "L" "M" "N" "O" "P" "Q" "R" "S" "T" "U" "V" "W" "X" "Y" "Z"])

(defn generate_code []
  (clojure.string/join [(rand-nth alphabet) (rand-nth alphabet) (rand-nth alphabet) (rand-nth alphabet)]))

(defn join_btn_press []
  (let [code (s/upper-case @data/current_code_text)]
    (when (contains? @data/active_games (keyword code))
      (do
        (reset! data/game_code code)
        (swap! data/num_players inc)
        (dispatch [:join-game @data/game_code])))))

(defn host_btn_press []
  (let [code (generate_code)]
    (swap! data/active_games conj [(keyword code) code])
    (reset! data/game_code code)
    (swap! data/num_players inc)
    (dispatch [:start-game @data/game_code])))

(defn name_change_join [e]
  (let [text (.-value (.-target e))]
    (reset! data/join_name text)))

(defn name_change_host [e]
  (let [text (.-value (.-target e))]
    (reset! data/host_name text)))

(defn code_change [e]
  (let [text (.-value (.-target e))]
    (reset! data/current_code_text text)))

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
    :disabled (or (= (count @data/join_name) 0) (not= (count @data/current_code_text) 4))}])

(defn host_text_cpt []
  [:h3 "Host Game"])

(defn host_btn_cpt []
  [:input.host_btn
   {:type "button" :value "Go!"
    :on-click host_btn_press
    :style {:width "100px"}
    :disabled (= (count @data/host_name) 0)}])

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