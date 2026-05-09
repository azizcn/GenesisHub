/**
 * Contextual AI Tutor guidance data for each node type.
 * Organized by node type → sub-type → section (whatItDoes, howToUse, whatToModify).
 */

export interface TutorGuidance {
  whatItDoes: { en: string; tr: string };
  howToUse: { en: string; tr: string };
  whatToModify: { en: string; tr: string };
}

const tutorData: Record<string, TutorGuidance> = {
  // ── State Struct ──────────────────────────────────────────
  "structNode:state": {
    whatItDoes: {
      en: "This block creates on-chain storage for your program. Think of it like a database table — each field is a column. When your program runs on Solana, this struct is serialized and stored in an account on the blockchain.",
      tr: "Bu blok, programınız için zincir üzerinde depolama oluşturur. Bunu bir veritabanı tablosu gibi düşünün — her alan bir sütundur. Programınız Solana'da çalıştığında, bu struct serileştirilir ve blockchain'deki bir hesapta saklanır.",
    },
    howToUse: {
      en: "Place this near the TOP of your flow. It defines the data your program will remember between transactions. In Anchor, this becomes an #[account] struct.",
      tr: "Bunu akışınızın ÜST kısmına yerleştirin. Programınızın işlemler arasında hatırlayacağı verileri tanımlar. Anchor'da bu #[account] struct olur.",
    },
    whatToModify: {
      en: "Change the struct name to describe your data (e.g., 'UserProfile', 'TokenState'). Add fields for each piece of data you need to store — like 'balance: u64' or 'owner: Pubkey'.",
      tr: "Struct adını verilerinizi tanımlamak için değiştirin (ör. 'UserProfile', 'TokenState'). Depolamanız gereken her veri parçası için alanlar ekleyin — 'balance: u64' veya 'owner: Pubkey' gibi.",
    },
  },

  // ── Context Struct ────────────────────────────────────────
  "structNode:context": {
    whatItDoes: {
      en: "This defines the accounts your instruction needs to execute. In Solana, every instruction must declare which accounts it will read or write. Think of it as the 'permissions list' for your function.",
      tr: "Bu, talimatınızın çalışması için gereken hesapları tanımlar. Solana'da her talimat hangi hesapları okuyacağını veya yazacağını bildirmelidir. Bunu fonksiyonunuz için 'izin listesi' olarak düşünün.",
    },
    howToUse: {
      en: "Connect this BELOW your State struct and ABOVE your Function block. It bridges your data storage to your program logic. In Anchor, this becomes a #[derive(Accounts)] struct.",
      tr: "Bunu State struct'ınızın ALTINA ve Function bloğunuzun ÜSTÜNE bağlayın. Veri depolamanızı program mantığınıza köprüler. Anchor'da bu #[derive(Accounts)] struct olur.",
    },
    whatToModify: {
      en: "Add the accounts your function needs: 'Signer<\\'info>' for the wallet signing the transaction, 'Account<\\'info, YourState>' for data accounts, 'Program<\\'info, System>' for system programs. Keep 'ctx' fields as they are.",
      tr: "Fonksiyonunuzun ihtiyaç duyduğu hesapları ekleyin: İşlemi imzalayan cüzdan için 'Signer<\\'info>', veri hesapları için 'Account<\\'info, YourState>', sistem programları için 'Program<\\'info, System>'. 'ctx' alanlarını olduğu gibi bırakın.",
    },
  },

  // ── Function Node ─────────────────────────────────────────
  functionNode: {
    whatItDoes: {
      en: "This is your program's instruction — the actual logic that runs on-chain. When someone calls your Solana program, this function executes. It receives a Context and returns a Result.",
      tr: "Bu, programınızın talimatıdır — zincir üzerinde çalışan gerçek mantık. Birisi Solana programınızı çağırdığında, bu fonksiyon çalışır. Bir Context alır ve bir Result döndürür.",
    },
    howToUse: {
      en: "Connect this BELOW your Context block. The edge between them tells the code generator which accounts this function can access. You can have multiple functions, each with their own Context.",
      tr: "Bunu Context bloğunuzun ALTINA bağlayın. Aralarındaki kenar, kod üretecisine bu fonksiyonun hangi hesaplara erişebileceğini söyler. Her biri kendi Context'ine sahip birden fazla fonksiyonunuz olabilir.",
    },
    whatToModify: {
      en: "Change the function name to describe what it does (e.g., 'initialize', 'transfer', 'mint_nft'). Edit the body with your Rust logic. The 'Ok(())' at the end means 'success' — keep it as the last line.",
      tr: "Fonksiyon adını ne yaptığını tanımlamak için değiştirin (ör. 'initialize', 'transfer', 'mint_nft'). Gövdeyi Rust mantığınızla düzenleyin. Sondaki 'Ok(())' 'başarılı' anlamına gelir — son satır olarak tutun.",
    },
  },

  // ── Transfer SOL Action ───────────────────────────────────
  "actionNode:transfer": {
    whatItDoes: {
      en: "This action block generates a SOL transfer instruction. It creates the system instruction to move SOL from one account to another using Solana's System Program.",
      tr: "Bu eylem bloğu bir SOL transfer talimatı oluşturur. Solana'nın System Program'ını kullanarak bir hesaptan diğerine SOL taşımak için sistem talimatını oluşturur.",
    },
    howToUse: {
      en: "This is a standalone action block — place it at the BOTTOM of your flow. It generates a complete transfer function with the necessary CPI (Cross-Program Invocation) calls.",
      tr: "Bu bağımsız bir eylem bloğudur — akışınızın ALT kısmına yerleştirin. Gerekli CPI (Cross-Program Invocation) çağrılarıyla eksiksiz bir transfer fonksiyonu oluşturur.",
    },
    whatToModify: {
      en: "Edit the 'amount' parameter name and type if needed. Add a 'recipient' parameter with type 'Pubkey' to specify where the SOL goes. You can add more params as needed.",
      tr: "'amount' parametre adını ve tipini gerekirse düzenleyin. SOL'un nereye gideceğini belirtmek için 'Pubkey' tipinde bir 'recipient' parametresi ekleyin. Gerektiğinde daha fazla parametre ekleyebilirsiniz.",
    },
  },

  // ── Mint Token Action ─────────────────────────────────────
  "actionNode:mint": {
    whatItDoes: {
      en: "This action block generates a token minting instruction. It uses the SPL Token Program to create new tokens and add them to a token account.",
      tr: "Bu eylem bloğu bir token basım talimatı oluşturur. Yeni token'lar oluşturmak ve bunları bir token hesabına eklemek için SPL Token Programını kullanır.",
    },
    howToUse: {
      en: "This is a standalone action block — place it at the BOTTOM of your flow. It generates mint_to CPI calls that interact with the Token Program.",
      tr: "Bu bağımsız bir eylem bloğudur — akışınızın ALT kısmına yerleştirin. Token Programı ile etkileşime giren mint_to CPI çağrıları oluşturur.",
    },
    whatToModify: {
      en: "Edit the 'amount' parameter to control how many tokens are minted. The amount is typically in the smallest unit (like lamports for SOL).",
      tr: "Kaç token basılacağını kontrol etmek için 'amount' parametresini düzenleyin. Miktar genellikle en küçük birimde belirtilir (SOL için lamport gibi).",
    },
  },

  // ── Template Node ─────────────────────────────────────────
  templateNode: {
    whatItDoes: {
      en: "This is a pre-built template that expands into a full set of blocks (State + Context + Function). It's a quick-start for common smart contract patterns like token creation or NFT minting.",
      tr: "Bu, tam bir blok setine (State + Context + Function) genişleyen önceden oluşturulmuş bir şablondur. Token oluşturma veya NFT basımı gibi yaygın akıllı kontrat kalıpları için hızlı başlangıçtır.",
    },
    howToUse: {
      en: "Click the 'Expand Template' button to generate the individual blocks. Once expanded, you can modify each block separately. The template node itself will be replaced.",
      tr: "'Şablonu Genişlet' düğmesine tıklayarak ayrı blokları oluşturun. Genişletildikten sonra her bloğu ayrı ayrı değiştirebilirsiniz. Şablon düğümünün kendisi değiştirilecektir.",
    },
    whatToModify: {
      en: "Don't modify the template directly — expand it first! After expansion, customize the generated State struct fields, Context accounts, and Function logic to match your project.",
      tr: "Şablonu doğrudan değiştirmeyin — önce genişletin! Genişletmeden sonra, oluşturulan State struct alanlarını, Context hesaplarını ve Function mantığını projenize uyacak şekilde özelleştirin.",
    },
  },
};

/**
 * Get the tutor data key for a given node.
 */
export function getTutorKey(nodeType: string, nodeData: Record<string, unknown>): string {
  if (nodeType === "structNode") {
    return `structNode:${nodeData.nodeCategory || "state"}`;
  }
  if (nodeType === "actionNode") {
    return `actionNode:${nodeData.actionType || "transfer"}`;
  }
  return nodeType;
}

/**
 * Get tutor guidance for a specific node.
 */
export function getTutorGuidance(
  nodeType: string,
  nodeData: Record<string, unknown>
): TutorGuidance | null {
  const key = getTutorKey(nodeType, nodeData);
  return tutorData[key] || null;
}

export default tutorData;
