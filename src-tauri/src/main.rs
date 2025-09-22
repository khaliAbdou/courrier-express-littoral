// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

// Commande pour sélectionner un dossier
#[tauri::command]
async fn select_directory() -> Result<String, String> {
    use tauri::api::dialog::blocking::FileDialogBuilder;
    
    match FileDialogBuilder::new().pick_folder() {
        Some(path) => Ok(path.to_string_lossy().to_string()),
        None => Err("Aucun dossier sélectionné".to_string()),
    }
}

// Commande pour lire un fichier
#[tauri::command]
async fn read_file(file_path: String) -> Result<String, String> {
    use std::fs;
    
    match fs::read_to_string(&file_path) {
        Ok(content) => Ok(content),
        Err(err) => Err(format!("Erreur lecture fichier: {}", err)),
    }
}

// Commande pour écrire un fichier
#[tauri::command]
async fn write_file(file_path: String, content: String) -> Result<(), String> {
    use std::fs;
    use std::path::Path;
    
    // Créer les dossiers parents si nécessaire
    if let Some(parent) = Path::new(&file_path).parent() {
        if let Err(err) = fs::create_dir_all(parent) {
            return Err(format!("Erreur création dossier: {}", err));
        }
    }
    
    match fs::write(&file_path, content) {
        Ok(_) => Ok(()),
        Err(err) => Err(format!("Erreur écriture fichier: {}", err)),
    }
}

// Commande pour lister les fichiers d'un dossier
#[tauri::command]
async fn list_files(dir_path: String) -> Result<Vec<String>, String> {
    use std::fs;
    
    match fs::read_dir(&dir_path) {
        Ok(entries) => {
            let mut files = Vec::new();
            for entry in entries {
                if let Ok(entry) = entry {
                    if let Some(name) = entry.file_name().to_str() {
                        files.push(name.to_string());
                    }
                }
            }
            Ok(files)
        },
        Err(err) => Err(format!("Erreur lecture dossier: {}", err)),
    }
}

// Commande pour vérifier la licence (placeholder)
#[tauri::command]
async fn check_license() -> Result<serde_json::Value, String> {
    Ok(serde_json::json!({
        "valid": true,
        "daysRemaining": 90
    }))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            select_directory,
            read_file,
            write_file,
            list_files,
            check_license
        ])
        .run(tauri::generate_context!())
        .expect("Erreur lors du démarrage de l'application Tauri");
}