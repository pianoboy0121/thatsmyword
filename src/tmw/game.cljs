(ns tmw.game
  (:require
   [reagent.core :as r]
   [lambdaisland.fetch :as fetch]
   [promesa.core :as p]
   [tmw.data :as data]))

(defn get_prompt []
  (rand-nth @data/prompts))

(def prompt (get_prompt))

(defn ingame_container []
  [:div
   (js/JSON.stringify prompt)
   (js/console.log prompt)])